import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Relationship, PersonNode } from '@/data/relationships';

interface NetworkGraphProps {
  nodes: PersonNode[];
  relationships: Relationship[];
}

export function NetworkGraph({ nodes, relationships }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<PersonNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<Relationship | null>(null);

  useEffect(() => {
    if (!svgRef.current || !nodes.length || !relationships.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    // Create arrow markers for directed edges
    svg.append('defs').selectAll('marker')
      .data(['ally', 'enemy', 'family', 'mentor', 'political', 'friend'])
      .join('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', d => {
        switch (d) {
          case 'ally': return '#10B981';
          case 'enemy': return '#EF4444';
          case 'family': return '#8B5CF6';
          case 'mentor': return '#F59E0B';
          case 'political': return '#6B7280';
          case 'friend': return '#06B6D4';
          default: return '#6B7280';
        }
      })
      .attr('d', 'M0,-5L10,0L0,5');

    // Convert relationships to d3 link format
    const links = relationships.map(r => ({
      source: r.source,
      target: r.target,
      type: r.type,
      description: r.description,
      strength: r.strength
    }));

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(150)
        .strength(d => (d as any).strength / 5))
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    // Create link elements
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => {
        switch (d.type) {
          case 'ally': return '#10B981';
          case 'enemy': return '#EF4444';
          case 'family': return '#8B5CF6';
          case 'mentor': return '#F59E0B';
          case 'political': return '#6B7280';
          case 'friend': return '#06B6D4';
          default: return '#6B7280';
        }
      })
      .attr('stroke-width', d => d.strength)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', d => `url(#arrow-${d.type})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedLink(d as any);
        setSelectedNode(null);
      });

    // Create node groups
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(d3.drag<any, PersonNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Add circles to nodes
    node.append('circle')
      .attr('r', 40)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .on('click', (event, d) => {
        setSelectedNode(d);
        setSelectedLink(null);
      });

    // Add labels to nodes
    node.append('text')
      .text(d => d.name)
      .attr('x', 0)
      .attr('y', 55)
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .style('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', d => `translate(${(d as any).x},${(d as any).y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, relationships]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6">
      <div className="flex-1 relative min-h-[500px] lg:min-h-[600px]">
        <svg
          ref={svgRef}
          className="w-full h-full border border-border rounded-lg bg-card"
        />
      </div>

      {/* Info Panel */}
      <div className="w-full lg:w-80 space-y-4">
        {selectedNode && (
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="font-display text-xl font-semibold mb-2" style={{ color: selectedNode.color }}>
              {selectedNode.name}
            </h3>
            <p className="text-sm italic text-muted-foreground mb-3">
              {selectedNode.latinName}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              {selectedNode.years}
            </p>
            <p className="text-sm font-medium">
              {selectedNode.description}
            </p>
          </div>
        )}

        {selectedLink && (
          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 text-xs font-medium rounded" style={{
                backgroundColor: selectedLink.type === 'ally' ? '#10B981' :
                  selectedLink.type === 'enemy' ? '#EF4444' :
                  selectedLink.type === 'family' ? '#8B5CF6' :
                  selectedLink.type === 'mentor' ? '#F59E0B' :
                  selectedLink.type === 'friend' ? '#06B6D4' : '#6B7280',
                color: '#fff'
              }}>
                {selectedLink.type === 'ally' ? 'Verbündeter' :
                  selectedLink.type === 'enemy' ? 'Feind' :
                  selectedLink.type === 'family' ? 'Familie' :
                  selectedLink.type === 'mentor' ? 'Mentor' :
                  selectedLink.type === 'friend' ? 'Freund' : 'Politisch'}
              </span>
              <span className="text-sm text-muted-foreground">
                Stärke: {selectedLink.strength}/5
              </span>
            </div>
            <p className="text-sm">
              {selectedLink.description}
            </p>
          </div>
        )}

        {!selectedNode && !selectedLink && (
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="font-display text-lg font-semibold mb-3">
              Beziehungsnetzwerk
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Klicke auf eine Person oder Verbindung, um mehr zu erfahren.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#8B5CF6' }} />
                <span className="text-xs">Familie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#10B981' }} />
                <span className="text-xs">Verbündeter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                <span className="text-xs">Feind</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#6B7280' }} />
                <span className="text-xs">Politisch</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                <span className="text-xs">Mentor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#06B6D4' }} />
                <span className="text-xs">Freund</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
